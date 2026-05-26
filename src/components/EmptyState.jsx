import { Link } from "react-router";

const EmptyState = ({
  icon = "👋",
  title,
  description,
  actionLabel,
  actionTo = "/",
}) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
    <div className="page-card w-full max-w-md p-8 sm:p-10">
      <div className="text-5xl sm:text-6xl mb-4" aria-hidden>
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-base-content mb-2">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-base-content/60 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Link to={actionTo} className="btn btn-primary btn-wide">
          {actionLabel}
        </Link>
      )}
    </div>
  </div>
);

export default EmptyState;
