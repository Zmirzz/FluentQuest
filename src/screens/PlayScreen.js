import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getRandomEntry, getCountryOptions, getDefinitionOptions } from '../data/words';
import { useGame } from '../context/GameContext';

const Dropdown = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 12, alignSelf: 'stretch' }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.select} onPress={() => setOpen((o) => !o)}>
        <Text style={styles.selectText}>{selected || 'Select'}</Text>
        <Text style={styles.chev}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 180 }}>
            {options.map((opt) => (
              <TouchableOpacity key={opt} style={styles.option} onPress={() => { onSelect(opt); setOpen(false); }}>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const Choice = ({ text, selected, onPress }) => (
  <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{text}</Text>
  </TouchableOpacity>
);

const PlayScreen = () => {
  const { recordGuess } = useGame();
  const [entry, setEntry] = useState(null); // { id, word, country, definition, hint }
  const [country, setCountry] = useState('');
  const [def, setDef] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [defOptions, setDefOptions] = useState([]);
  const [result, setResult] = useState(null);

  const load = async () => {
    const e = await getRandomEntry();
    setEntry(e);
    setCountry('');
    setDef('');
    setCountryOptions(getCountryOptions(e.country));
    setDefOptions(getDefinitionOptions(e.definition));
    setResult(null);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!entry) return;
    const countryCorrect = country === entry.country;
    const meaningCorrect = def === entry.definition;
    const { points } = await recordGuess({ wordId: entry.id, countryCorrect, meaningCorrect, isDaily: false });
    setResult({ countryCorrect, meaningCorrect, points });
  };

  return (
    <View style={styles.container}>
      {entry && (
        <>
          <Text style={styles.word}>{entry.word}</Text>
          <Text style={styles.hint}>{entry.hint}</Text>

          <Dropdown
            label="Country of origin"
            options={countryOptions}
            selected={country}
            onSelect={setCountry}
          />

          <Text style={styles.label}>Select the best definition</Text>
          <View style={styles.choicesWrap}>
            {defOptions.map((opt) => (
              <Choice key={opt} text={opt} selected={opt === def} onPress={() => setDef(opt)} />
            ))}
          </View>

          {!result ? (
            <TouchableOpacity style={styles.button} onPress={submit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>{result.countryCorrect ? 'Correct Country!' : 'Incorrect Country'}</Text>
              {!result.countryCorrect && <Text style={styles.resultText}>Actual: {entry.country}</Text>}
              <Text style={styles.resultText}>{result.meaningCorrect ? 'Definition bonus +5' : `Definition: ${entry.definition}`}</Text>
              <Text style={styles.points}>Points: {result.points}</Text>
              <TouchableOpacity style={[styles.button, styles.secondary]} onPress={load}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#FAFBFF' },
  word: { fontSize: 28, fontWeight: 'bold', marginBottom: 4, color: '#2D3A6E' },
  hint: { color: '#6B778C', marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 6, color: '#334155' },
  select: { borderWidth: 1, borderColor: '#C7D2FE', borderRadius: 10, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' },
  selectText: { color: '#1F2937' },
  chev: { color: '#6B7280' },
  dropdown: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, backgroundColor: '#fff', marginTop: 6, overflow: 'hidden' },
  option: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optionText: { color: '#334155' },
  choicesWrap: { marginBottom: 12 },
  choice: { padding: 12, borderRadius: 10, backgroundColor: '#EEF2FF', marginBottom: 8 },
  choiceSelected: { backgroundColor: '#4F46E5' },
  choiceText: { color: '#374151', fontWeight: '600' },
  choiceTextSelected: { color: '#fff' },
  button: { backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start', marginTop: 8 },
  secondary: { backgroundColor: '#0EA5E9' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  resultBox: { marginTop: 16, backgroundColor: '#fff', padding: 12, borderRadius: 8, borderColor: '#e0e0e0', borderWidth: 1 },
  resultTitle: { fontWeight: 'bold', marginBottom: 6 },
  resultText: { marginBottom: 4 },
  points: { fontWeight: 'bold', color: '#2E7D32' },
});

export default PlayScreen;
