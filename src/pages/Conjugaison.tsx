import React, { useState } from 'react';

const Conjugaison: React.FC = () => {
  const [verb, setVerb] = useState('');
  type ConjugaisonResult = {
    verb: string;
    conjugations?: Array<{ tense: string; forms: Array<{ pronoun: string; form: string }> }>;
  };
  const [result, setResult] = useState<ConjugaisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      // API fictive ou exemple
      const res = await fetch(`https://russianconjugator.herokuapp.com/conjugate?verb=${encodeURIComponent(verb)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Conjugaison russe</h1>
      <div className="flex gap-2 mb-4">
        <input value={verb} onChange={e => setVerb(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="Verbe russe..." />
        <button onClick={search} className="bg-blue-600 text-white px-4 py-1 rounded">Conjuguer</button>
      </div>
      {loading && <div>Recherche...</div>}
      {result && (
        <div className="bg-gray-50 p-4 rounded shadow">
          <div className="font-bold text-lg mb-2">{result.verb}</div>
          <ul>
            {result.conjugations?.map((c: any, i: number) => (
              <li key={i} className="mb-1">
                <span className="font-semibold">{c.tense}:</span> {c.form}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && result === null && verb && <div className="text-red-500">Aucun résultat trouvé.</div>}
    </div>
  );
};

export default Conjugaison;
