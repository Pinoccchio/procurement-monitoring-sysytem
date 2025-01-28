import { supabase } from "@/utils/auth"

export async function getRemainingFunds(): Promise<number | null> {
  try {
    const { data, error } = await supabase.from("remaining_funds").select("amount").single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    if (!data) {
      console.error("No data returned from Supabase")
      throw new Error("No data returned from database")
    }

    return data.amount
  } catch (error) {
    console.error("Error fetching remaining funds:", error)
    throw new Error("Failed to fetch remaining funds")
  }
}

export async function updateRemainingFunds(amount: number): Promise<void> {
  try {
    // Since there's only one row in the remaining_funds table, we don't need a where clause
    const { error } = await supabase.from("remaining_funds").update({ amount: amount }).eq("id", 1) // Assuming the single row always has id = 1

    if (error) {
      console.error("Error updating remaining funds:", error)
      throw error
    }
  } catch (error) {
    console.error("Error updating remaining funds:", error)
    throw error
  }
}

