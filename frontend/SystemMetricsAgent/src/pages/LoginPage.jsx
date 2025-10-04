// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import MessageBox from "../components/MessageBox";

// export default function Login() {
//   const [message, setMessage] = useState("");
//   const location = useLocation();
//   const role = new URLSearchParams(location.search).get("role");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setMessage("Login submitted successfully!");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//       <h2 className="text-xl font-bold mb-4">Login {role && `as ${role}`}</h2>
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 w-72 bg-white p-6 rounded-lg shadow-md"
//       >
//         <input
//           type="text"
//           placeholder="Email or Username"
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Login
//         </button>
//       </form>
//       <div className="mt-3">
//         <Link to="/signup" className="text-blue-500 mr-4">
//           Signup
//         </Link>
//         <Link to="/forget-password" className="text-blue-500">
//           Forget Password?
//         </Link>
//       </div>
//       {message && <MessageBox message={message} />}
//     </div>
//   );
// }


export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold">Login Page</h1>
      <p className="mt-2 text-gray-600">Role passed in query string.</p>
    </div>
  );
}
