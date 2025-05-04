import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { UserData } from './types';
import sampleData from './api-data0.json';
import { Turtle } from 'lucide-react';

interface DataContextProps {
  userData: UserData;
  isLoading: boolean;
  refetchData: () => void;
}

const DataContext = createContext<DataContextProps>({
  userData: sampleData,
  isLoading: true,
  refetchData: () => {},
});

export const useDataContext = () => useContext(DataContext);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [userData, setUserData] = useState<UserData>(sampleData);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch data from your API or JSON file
  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const isPharos = true;
      const url = isPharos
        ? `https://baristenet-sequencer-pharos-advance.fly.dev/solvers/${address}`
        : `https://baristenet-sequencer.fly.dev/solvers/${address}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setUserData(data);
      } else {
        // console.log('No data found for', address);
        setUserData(sampleData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load or when address changes
  useEffect(() => {
    if (isConnected && address) {
      // console.log('Fetching user data for:', address);
      fetchUserData();
    }
  }, [address, isConnected]);

  return (
    <DataContext.Provider
      value={{
        userData,
        isLoading,
        refetchData: fetchUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
