import React, { useEffect, useState } from 'react';
import { PathWords } from '@/api/words';
import axios from 'axios';

function Words() {
  const [words, setAWords] = useState<string>('');

  useEffect(() => {
    axios.get(PathWords).then((res) => {
      setAWords(res.data);
    });
  }, []);

  return <div>{words}</div>;
}

export default Words;
