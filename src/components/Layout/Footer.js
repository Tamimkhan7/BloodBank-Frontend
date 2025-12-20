import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-900 dark:text-gray-300 w-full mt-8">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Section 1 */}
        <div className="space-y-2">         
          <p>Made with <span className="text-red-500">&hearts;</span> by Tamim khan</p>   
          <p className="font-semibold">Copyright © <Link to="https://www.codist.dev/"> Codist</Link>  2015 - Present</p> 
        </div>

        {/* Section 2 */}
        <div className="space-y-2">        
          <Link to="/terms" className="block hover:underline">Terms & Conditions</Link>
          
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <Link to="/contact" className="block hover:underline">Contact Us</Link>     
    
        </div>

        {/* Section 4 */}
        <div className="space-y-2">     
       <Link to="/privacy" className="block hover:underline">Privacy Policy</Link>  
        
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 text-center text-sm ">
        
        <p>&copy; {new Date().getFullYear()} Codist. All rights reserved.</p>
      </div>
    </footer>
  );
}
