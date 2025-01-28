import type {
  CreatePurchaseRequest,
  PurchaseRequest,
  TrackingEntry,
  PRStatus,
  PRDesignation,
} from "@/types/procurement/purchase-request"
import type { User } from "@/types/procurement/user"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export async function createPurchaseRequest(data: CreatePurchaseRequest): Promise<PurchaseRequest> {
  try {
    const { data: pr, error } = await supabaseClient
      .from("purchase_requests")
      .insert([
        {
          pr_number: data.pr_number,
          description: data.description,
          current_designation: data.current_designation,
        },
      ])
      .select()
      .single()

    if (error) throw error

    const { error: trackingError } = await supabaseClient.from("tracking_history").insert([
      {
        pr_id: pr.id,
        status: "pending",
        designation: data.current_designation,
        notes: "Initial creation",
        notification_type: "procurement",
      },
    ])

    if (trackingError) throw trackingError

    return pr
  } catch (error) {
    console.error("Error in createPurchaseRequest:", error)
    throw error
  }
}

export async function getPurchaseRequests(): Promise<PurchaseRequest[]> {
  const { data, error } = await supabaseClient
    .from("purchase_requests")
    .select(`
      *,
      tracking_history (*)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as PurchaseRequest[]
}

export async function updatePurchaseRequestStatus(
  prId: string,
  status: PRStatus,
  nextDesignation: PRDesignation,
  notes?: string,
): Promise<void> {
  const { error: updateError } = await supabaseClient
    .from("purchase_requests")
    .update({
      status: status,
      current_designation: nextDesignation,
    })
    .eq("id", prId)

  if (updateError) throw updateError

  const { error: trackingError } = await supabaseClient.from("tracking_history").insert([
    {
      pr_id: prId,
      status: status,
      designation: nextDesignation,
      notes: notes,
      notification_type: "procurement",
    },
  ])

  if (trackingError) throw trackingError
}

export async function getTrackingHistory(purchaseRequestId?: string): Promise<TrackingEntry[]> {
  try {
    let query = supabaseClient
      .from("tracking_history")
      .select(`
        *,
        purchase_requests (pr_number)
      `)
      .order("created_at", { ascending: false })

    if (purchaseRequestId) {
      query = query.eq("pr_id", purchaseRequestId)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map((entry) => ({
      ...entry,
      pr_number: entry.purchase_requests.pr_number,
    })) as TrackingEntry[]
  } catch (error) {
    console.error("Error fetching tracking history:", error)
    throw new Error("Failed to fetch tracking history")
  }
}

export async function getUserProfile(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error("No user found")
    }

    const { data, error } = await supabaseClient
      .from("users")
      .select("id, first_name, last_name, email, account_type")
      .eq("id", user.id)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw new Error("Failed to fetch user profile")
  }
}

