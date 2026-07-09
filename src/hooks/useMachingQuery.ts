import { useQuery } from '@tanstack/react-query';
import { getMatchingReport } from '../api/maching';

export const useMatchingReport = () => {
  return useQuery({
    queryKey: ['matchingReport'], 
    queryFn: getMatchingReport,   
  });
};