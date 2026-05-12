const ErrorState = ({ message = "Something went wrong." }) => (
  <div className="shell border-red-500/25 bg-red-500/5 p-6 text-sm text-red-200">{message}</div>
);

export default ErrorState;
