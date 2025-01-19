import type { CreatePurchaseRequest, PurchaseRequest, TrackingEntry, PRStatus, PRDesignation } from '@/types/procurement/purchase-request'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export async function createPurchaseRequest(data: CreatePurchaseRequest): Promise<PurchaseRequest> {
  try {
    const { data: pr, error } = await supabaseClient
      .from('purchase_requests')
      .insert([{
        pr_number: data.pr_number,
        department: data.department,
        current_designation: data.current_designation,
        document_url: data.document_url
      }])
      .select()
      .single()

    if (error) throw error

    const { error: trackingError } = await supabaseClient
      .from('tracking_history')
      .insert([{
        pr_id: pr.id,
        status: 'pending',
        designation: data.current_designation,
        notes: 'Initial creation'
      }])

    if (trackingError) throw trackingError

    return pr
  } catch (error) {
    console.error('Error in createPurchaseRequest:', error)
    throw error
  }
}

export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  const { data, error } = await supabaseClient
    .from('purchase_requests')
    .select(`
      *,
      tracking_history (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as PurchaseRequest[]
}

export async function updatePurchaseRequestStatus(
  prId: string, 
  status: PRStatus,
  nextDesignation: PRDesignation,
  notes?: string
): Promise<void> {
  const { error: updateError } = await supabaseClient
    .from('purchase_requests')
    .update({ 
      status: status,
      current_designation: nextDesignation
    })
    .eq('id', prId)

  if (updateError) throw updateError

  const { error: trackingError } = await supabaseClient
    .from('tracking_history')
    .insert([{
      pr_id: prId,
      status: status,
      designation: nextDesignation,
      notes: notes
    }])

  if (trackingError) throw trackingError
}

export async function uploadDocument(file: File, retries = 3): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `documents/${fileName}`

    const { data, error } = await supabaseClient
      .storage
      .from('purchase-request-documents')
      .upload(filePath, file)

    if (error) {
      console.error('Supabase Storage upload error:', error)
      if (retries > 0) {
        console.log(`Retrying upload... (${retries} attempts left)`)
        return uploadDocument(file, retries - 1)
      }
      throw error
    }

    if (!data) {
      throw new Error('No data returned from Supabase Storage upload')
    }

    const { data: { publicUrl } } = supabaseClient
      .storage
      .from('purchase-request-documents')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading document:', error)
    
    // Fallback: Return a placeholder URL if Supabase Storage is unavailable
    return `https://placeholder-url.com/${file.name}`
  }
}

export async function getTrackingHistory(purchaseRequestId: string): Promise<TrackingEntry[]> {
  try {
    const { data, error } = await supabaseClient
      .from('tracking_history')
      .select('*')
      .eq('pr_id', purchaseRequestId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching tracking history:', error)
    throw new Error('Failed to fetch tracking history')
  }
}

export { supabaseClient }

