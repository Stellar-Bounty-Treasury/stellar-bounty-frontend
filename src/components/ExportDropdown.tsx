import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, ChevronDown } from 'lucide-react';

interface ExportDropdownProps {
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportCsv, onExportJson }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '6px 12px' }}
      >
        <Download size={14} /> Export <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 6,
            width: 170,
            borderRadius: 8,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => {
              onExportCsv();
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <FileSpreadsheet size={14} color="#34d399" /> Export CSV Ledger
          </button>

          <button
            onClick={() => {
              onExportJson();
              setIsOpen(false);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <FileJson size={14} color="#38bdf8" /> Export JSON Data
          </button>
        </div>
      )}
    </div>
  );
};
