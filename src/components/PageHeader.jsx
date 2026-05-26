const PageHeader = ({ title, description, children }) => (
  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm sm:text-base text-base-content/60 max-w-xl">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

export default PageHeader;
