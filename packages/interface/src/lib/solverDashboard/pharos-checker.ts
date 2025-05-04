import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function PharosHealthChecker() {
  const wasHealthyRef = useRef(true); // Assume healthy at first

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          'https://baristenet-sequencer-pharos.fly.dev/check'
        );
        const data = await res.json();

        if (data.error) {
          if (wasHealthyRef.current) {
            toast.error(data.error || 'Pharos RPC is down');
            wasHealthyRef.current = false;
          }
        } else {
          if (!wasHealthyRef.current) {
            toast.success('Pharos RPC is back online');
            wasHealthyRef.current = true;
          }
        }

        console.log(data);
      } catch (err) {
        if (wasHealthyRef.current) {
          toast.error('Unexpected error checking Pharos RPC');
          wasHealthyRef.current = false;
        }
      }
    }, 5000); // Run every 13 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}
