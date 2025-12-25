import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  if (!password) {
    return null;
  }

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const getIcon = (isValid: boolean) => {
    return isValid ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> :
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="mt-2 space-y-1 text-sm">
      <div className="flex items-center gap-2">
        {getIcon(requirements.length)}
        <span className={requirements.length ? 'text-green-400' : 'text-gray-400'}>
          Mínimo 8 caracteres
        </span>
      </div>
      <div className="flex items-center gap-2">
        {getIcon(requirements.uppercase)}
        <span className={requirements.uppercase ? 'text-green-400' : 'text-gray-400'}>
          Uma letra maiúscula
        </span>
      </div>
      <div className="flex items-center gap-2">
        {getIcon(requirements.lowercase)}
        <span className={requirements.lowercase ? 'text-green-400' : 'text-gray-400'}>
          Uma letra minúscula
        </span>
      </div>
      <div className="flex items-center gap-2">
        {getIcon(requirements.number)}
        <span className={requirements.number ? 'text-green-400' : 'text-gray-400'}>
          Um número
        </span>
      </div>
    </div>
  );
}
