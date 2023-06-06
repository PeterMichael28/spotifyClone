import { useEffect, useState, createContext, useContext } from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';

import { UserDetails, Subscription } from '@/type';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();

  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsloadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);


/**
 * This code defines a function called getUserDetails. It uses the Supabase client to interact with the "users" table in the database.

supabase.from('users') specifies the table named "users" from which we want to retrieve data.
.select('*') indicates that we want to select all columns from the "users" table.
.single() fetches a single row of data that matches the query.
The getUserDetails function returns a promise that resolves to a single row containing all columns from the "users" table.
 */
    
  const getUserDetails = () => supabase.from('users').select('*').single();

  /**
   * Here, the code defines a function called getSubscription. It interacts with the "subscriptions" table in the Supabase database.

    supabase.from('subscriptions') specifies the "subscriptions" table as the data source.
    .select('*, prices(*, products(*))') indicates that we want to select all columns from the "subscriptions" table, as well as the related "prices" and "products" tables, with all their columns.
    .in('status', ['trialing', 'active']) filters the query to only include rows where the "status" column has a value of either "trialing" or "active".
    .single() fetches a single row that satisfies the query conditions.
    The getSubscription function returns a promise that resolves to a single row containing all columns from the "subscriptions" table, along with the related data from the "prices" and "products" tables.
   */
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
            const [userDetailsPromise, subscriptionPromise] = results;

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsloadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
      } else return
      
  }, [user, isLoadingUser]);

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};