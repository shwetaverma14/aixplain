import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

function Footer() {
  const { darkMode } = useAppContext()
  
  return (
    <footer className={`py-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} MediAssist AI. All rights reserved.
            </p>
            <p className="text-xs mt-1">
              This tool is for educational purposes only and does not replace professional medical advice.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/health-education" className="text-sm hover:text-primary">
              Health Resources
            </Link>
            
            
            <a href="#" className="text-sm hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-primary">
              Terms of Use
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs">
          <p>
            In case of emergency, please contact your local emergency services immediately.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer