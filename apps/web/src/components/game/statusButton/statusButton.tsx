export const StatusButton = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row text-3xl gap-4">
            {children}
        </div>
    );
};