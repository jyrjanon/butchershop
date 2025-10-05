// components/FormField.js
import { motion } from 'framer-motion';

// Animation variants for the form item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FormField({ label, type = 'text', value, onChange, required = true }) {
  const isTextarea = type === 'textarea';
  
  // Logic to determine if the label should be in the "floated" state
  const isFloated = value && value.length > 0;

  return (
    <motion.div variants={itemVariants} className="relative group">
      <label
        htmlFor={label}
        className={`absolute left-3 text-gray-500 pointer-events-none transition-all duration-300 
                   group-focus-within:-top-2.5 group-focus-within:left-2 group-focus-within:text-xs group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-red-600 group-focus-within:z-10
                   ${isFloated ? '-top-2.5 left-2 text-xs bg-white px-1 text-red-600 z-10' : 'top-3'}`}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          id={label}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 peer"
          rows="3"
        />
      ) : (
        <input
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 peer"
        />
      )}
    </motion.div>
  );
}