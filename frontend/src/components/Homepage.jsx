import React from 'react'

const Homepage = () => {
  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      
      {/* Header */}
      <header className="text-center mb-10 relative">
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            &lt;
          </span>
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            PassVault
          </span>
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            /&gt;
          </span>
        </div>
        <p className="text-gray-300 mt-2">
          Store, manage, and secure all your passwords in one place
        </p>
      </header>

      {/* Notification Toast */}
      {notification.show && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-white max-w-xs text-center transition-opacity duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          aria-label="Search passwords"
        />
      </div>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-8 border border-gray-700 transition-transform hover:shadow-blue-500/10"
      >
        <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
          <input
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={generatePassword}
            className="text-sm text-blue-400 hover:underline"
          >
            Generate Strong Password
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-6 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {editingIndex !== null ? "Update Password" : "Save Password"}
          </button>
        </div>
      </form>

      {/* Password List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-md animate-pulse"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:scale-3d">
                  <div className="flex items-center gap-3 hover:scale-3d">
                    <div className="w-10 h-10 rounded-full bg-gray-600 hover:scale-3d"></div>
                    <div className="space-y-2 hover:scale-3d">
                      <div className="h-4 w-24 bg-gray-600 rounded hover:scale-3d"></div>
                      <div className="h-3 w-16 bg-gray-600 rounded hover:scale-3d"></div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-8 w-16 bg-gray-600 rounded"></div>
                    <div className="h-5 w-5 bg-gray-600 rounded"></div>
                    <div className="h-5 w-5 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : filteredPasswords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No passwords found.
          </div>
        ) : (
          filteredPasswords.map((entry, index) => (
            <PasswordCard
              key={entry._id}
              entry={entry}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={() => handleCopy(entry.password, index)}
              copiedIndex={copiedIndex}
            />
          ))
        )}
      </div>
      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            &copy; {new Date().getFullYear()} PassVault — Securely manage your
            passwords.
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://github.com/Kartik-1818"
              className="text-gray-500 hover:text-neutral-200 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.795-.26.795-.577v-2.234c-3.338.724-4.033-1.469-4.033-1.469-.546-1.387-1.333-1.756-1.333-1.756-1.09-.742.083-.726.083-.726 1.205.084 1.839 1.237 1.839 1.237 1.06 1.803 2.8 1.28 3.492 1.0.108-.775.419-1.28.762-1.573-2.665-.301-5.466-1.332-5.466-5.929 0-1.31.467-2.38 1.236-3.22-.124-.301-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.956-.266 1.98-.399 2.999-.404 1.02.005 2.046.138 2.996.404 2.29-1.552 3.296-.13 3.296-.13.653 1.653.242 2.876.118 3.176.77.84.366 1.91.366 3.22 0 4.609-2.807 5.624-5.479 5.922.43.37.814 1.097.814 2.22 0 1.605-.015 2.896-.015 3.299 0 .32.216.694.824.577A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://wa.me/8209552235"
              className="text-gray-500 hover:text-green-400 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.77 11.77 0 0 0 12 0a11.94 11.94 0 0 0-10.3 17.9L0 24l6.28-1.65A11.9 11.9 0 0 0 12 24c6.63 0 12-5.37 12-12a11.77 11.77 0 0 0-3.48-8.52zM12 22a9.86 9.86 0 0 1-5.16-1.43l-.37-.23-3.73.98 1-3.64-.24-.38A9.88 9.88 0 0 1 2 12C2 6.49 6.49 2 12 2s10 4.49 10 10-4.49 10-10 10zm5.39-7.23c-.29-.14-1.71-.84-1.97-.93s-.46-.14-.65.15-.74.93-.91 1.12-.34.22-.63.07a8.1 8.1 0 0 1-2.39-1.47 9.05 9.05 0 0 1-1.66-2.06c-.17-.29 0-.44.13-.6.14-.14.29-.34.44-.51a2.1 2.1 0 0 0 .29-.48.56.56 0 0 0 0-.51c-.07-.14-.65-1.56-.89-2.14s-.47-.48-.65-.49h-.55a1.07 1.07 0 0 0-.78.37 3.26 3.26 0 0 0-1 2.43 5.72 5.72 0 0 0 1.19 2.81c.15.21 1.9 3 4.61 4.21a15.7 15.7 0 0 0 1.56.57 3.75 3.75 0 0 0 1.72.11c.52-.08 1.71-.7 1.95-1.38s.24-1.25.17-1.37-.27-.2-.56-.33z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/kartik-jhamb-b68a96326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939V20.452H9.351V9h3.414v1.563h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.233zM5.337 8.083c-1.135 0-2.055-.92-2.055-2.055 0-1.136.92-2.055 2.055-2.055 1.135 0 2.056.919 2.056 2.055 0 1.135-.921 2.055-2.056 2.055zm1.98 12.218H3.315V9.301h3.999v11.4z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/kartikj_1718?igsh=MWdycjV3dG9laWh6eQ=="
              className="text-gray-500 hover:text-pink-500 transition-colors"
              aria-label="Website"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Made with ❤️ using React, TailwindCSS, and MongoDB Atlas
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
