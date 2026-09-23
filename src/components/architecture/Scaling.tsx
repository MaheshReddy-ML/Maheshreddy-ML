'use client';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
export default function Scaling() {
  const [value, setValue] = useState(7);
  return (
    <section className="scaling paper-panel">
      <span className="kicker">TRY A SMALL EXAMPLE</span>
      <h2>The same value. Two different scales.</h2>
      <p>
        Illustrative values: [1, 3, 5, 7, 9]. Mean = 5; population standard
        deviation ≈ 2.83.
      </p>
      <label htmlFor="sample">
        Input value: <strong>{value}</strong>
      </label>
      <input
        id="sample"
        type="range"
        min="1"
        max="9"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <Tabs defaultValue="minmax">
        <TabsList aria-label="Feature scaling method">
          <TabsTrigger value="minmax">Min-max normalization</TabsTrigger>
          <TabsTrigger value="standard">Standardization</TabsTrigger>
        </TabsList>
        <TabsContent value="minmax">
          <code>(x − min) / (max − min)</code>
          <output>{((value - 1) / 8).toFixed(3)}</output>
          <p>
            Maps this example’s range to [0, 1]. A constant feature needs
            separate handling because its range is zero.
          </p>
        </TabsContent>
        <TabsContent value="standard">
          <code>(x − μ) / σ</code>
          <output>{((value - 5) / Math.sqrt(8)).toFixed(3)}</output>
          <p>
            Centers at the mean and measures distance in standard deviations.
            Values are not restricted to [0, 1].
          </p>
        </TabsContent>
      </Tabs>
      <p className="small-print">
        Teaching example only. These values are not results from the
        breast-cancer study.
      </p>
    </section>
  );
}
