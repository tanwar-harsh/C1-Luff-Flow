interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="mx-auto max-w-content px-4 py-8 md:px-margin">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h1 className="text-display text-foreground">{title}</h1>}
          {subtitle && (
            <p className="mt-1 text-body-md text-on-surface-variant">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
