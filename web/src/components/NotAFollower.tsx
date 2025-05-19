import { UserX } from "lucide-react";

function NotAFollower({text}: {text:string}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <UserX className="w-16 h-16 mb-4 text-red-400" />

      <h3 className="text-lg font-semibold text-red-600 mb-2">Restricted Access</h3>
      <p className="text-red-500 text-sm">
        {text}
      </p>
    </div>
  );
}

export default NotAFollower;
