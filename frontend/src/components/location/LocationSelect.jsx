export function LocationSelect({ label, value, options, onChange, disabled, loading, placeholder }) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="font-semibold text-gray-700">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        className="p-3 border rounded-md bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{loading ? 'Carregando...' : placeholder}</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}