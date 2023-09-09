import React, { useEffect, useState } from 'react';
import { PathAdmin } from '@/api/words';
import axios from 'axios';

function AdminWord() {
  const [admin, setAdmin] = useState<string>('');

  useEffect(() => {
    axios.get(PathAdmin).then((res) => {
      setAdmin(res.data);
    });
  }, []);

  return <div>{admin}</div>;
}

export default AdminWord;
