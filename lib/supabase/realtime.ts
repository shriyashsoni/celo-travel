import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface RealtimeSubscription {
  unsubscribe: () => void
}

export function subscribeToTable<T = any>(
  table: string,
  callback: (payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE"
    new: T | null
    old: T | null
  }) => void,
): RealtimeSubscription {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      callback,
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

export function subscribeToUserPolicies(userId: string, callback: (payload: any) => void): RealtimeSubscription {
  const channel = supabase
    .channel(`user_${userId}_policies`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "policies",
        filter: `user_id=eq.${userId}`,
      },
      callback,
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

export function subscribeToClaimsUpdates(callback: (payload: any) => void): RealtimeSubscription {
  const channel = supabase
    .channel("claims_updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "claims",
      },
      callback,
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}

export function subscribeToPoolUpdates(callback: (payload: any) => void): RealtimeSubscription {
  const channel = supabase
    .channel("pool_updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "insurance_pools",
      },
      callback,
    )
    .subscribe()

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel)
    },
  }
}
