import React from 'react';
import { useDemoMode, PersonaRole, DEMO_PERSONAS } from '../context/DemoModeContext';
import { UserCheck } from 'lucide-react';

export const PersonaSwitcher: React.FC = () => {
  const { isDemoMode, activePersona, setPersonaRole } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div
      className="persona-switcher"
      id="judge-persona-switcher"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '3px 8px',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
      }}
    >
      <UserCheck size={14} color={activePersona.avatarBg} />
      <select
        value={activePersona.id}
        onChange={(e) => setPersonaRole(e.target.value as PersonaRole)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#f8fafc',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
        }}
        title="Switch Judge Persona"
        id="persona-select-dropdown"
      >
        {Object.values(DEMO_PERSONAS).map((p) => (
          <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
            {p.name} ({p.id.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
};
