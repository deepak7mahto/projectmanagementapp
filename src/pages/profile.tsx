import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import { getProfileById, updateProfile } from "../utils/supabaseUsers";

export default function ProfilePage() {
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  // Preferences
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user && !userLoading) {
      router.replace("/auth");
      return;
    }
    if (user) {
      setLoading(true);
      getProfileById(user.id)
        .then((profile) => {
          setProfile(profile);
          setDisplayName(profile.displayName || "");
          setFullName(profile.full_name || "");
          setBio(profile.bio || "");
          setPhone(profile.phone || "");
          setLocation(profile.location || "");
          setJobTitle(profile.job_title || "");
          setGithubUrl(profile.github_url || "");
          setLinkedinUrl(profile.linkedin_url || "");
          // Preferences
          const prefs = profile.preferences || {};
          setDarkMode(!!prefs.darkMode);
          setEmailNotifications(prefs.emailNotifications !== false); // default true
        })
        .catch((err) => setError("Failed to load profile: " + err.message))
        .finally(() => setLoading(false));
    }
  }, [user, userLoading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const updated = await updateProfile(profile.id, {
        displayName,
        full_name: fullName,
        bio,
        phone,
        location,
        job_title: jobTitle,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        preferences: {
          darkMode,
          emailNotifications,
        },
      });
      setProfile(updated);
      setSuccess("Profile updated successfully.");
    } catch (err: any) {
      setError("Failed to update profile: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profile)
    return (
      <div className="p-8 text-center text-red-500">Profile not found.</div>
    );

  return (
    <div className="mx-auto max-w-xl p-8">
      <h2 className="mb-6 text-2xl font-bold">User Profile</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="mb-1 block font-medium">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="fullName" className="mb-1 block font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="bio" className="mb-1 block font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            className="w-full rounded border px-3 py-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio about you"
            rows={2}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label htmlFor="location" className="mb-1 block font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="mb-1 block font-medium">
            Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Your job title"
          />
        </div>
        <div>
          <label htmlFor="githubUrl" className="mb-1 block font-medium">
            GitHub URL
          </label>
          <input
            id="githubUrl"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </div>
        <div>
          <label htmlFor="linkedinUrl" className="mb-1 block font-medium">
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">Email</label>
          <input
            type="text"
            className="w-full rounded border bg-gray-100 px-3 py-2"
            value={user?.email || ""}
            disabled
          />
        </div>

        {/* User Preferences Section */}
        <div className="mt-8 border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold">Preferences</h3>
          <div className="mb-4 flex items-center">
            <input
              id="darkMode"
              type="checkbox"
              className="mr-2"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <label htmlFor="darkMode" className="font-medium">
              Enable Dark Mode
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="emailNotifications"
              type="checkbox"
              className="mr-2"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <label htmlFor="emailNotifications" className="font-medium">
              Email Notifications
            </label>
          </div>
        </div>

        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
