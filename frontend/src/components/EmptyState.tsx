interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <Icon 
          size={36} 
          color="#a78bfa" 
          strokeWidth={1.5}
        />
      </div>
      
      <h3 style={{
        color: 'var(--text-primary)',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      
      <p style={{
        fontSize: '1rem',
        marginBottom: actionLabel ? '1.5rem' : '0',
        maxWidth: '400px',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};