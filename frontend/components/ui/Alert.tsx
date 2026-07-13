interface AlertProps {
  message: string;
  details?: string[];
}

export function Alert({ message, details }: AlertProps) {
  return (
    <div
      className="rounded border-l-4 border-error bg-error-container px-4 py-3 text-error-foreground"
      role="alert"
    >
      <p className="text-body-md font-medium">{message}</p>
      {details && details.length > 0 && (
        <ul className="mt-1 list-inside list-disc text-body-md">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
