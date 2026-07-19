// File test format sai: dùng double quotes, không có semicolon đúng chỗ, indent 4 space
import { useState } from 'react';

export function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}
