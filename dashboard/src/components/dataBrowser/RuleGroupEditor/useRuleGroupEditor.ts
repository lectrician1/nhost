import { createContext, useContext } from 'react';

export const RuleGroupEditorContext = createContext<{
  schema: string;
  table: string;
}>({
  schema: '',
  table: '',
});

export default function useRuleGroupEditor() {
  const context = useContext(RuleGroupEditorContext);

  if (!context) {
    throw new Error('useRuleGroupEditor must be used within a RuleGroupEditor');
  }

  return context;
}
