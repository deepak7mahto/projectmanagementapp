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
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="displayName" className="block font-medium mb-1">Display Name</label>
          <input
            id="displayName"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block font-medium mb-1">Full Name</label>
          <input
            id="fullName"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block font-medium mb-1">Bio</label>
          <textarea
            id="bio"
            className="w-full rounded border px-3 py-2"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="A short bio about you"
            rows={2}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
          <input
            id="phone"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div>
          <label htmlFor="location" className="block font-medium mb-1">Location</label>
          <input
            id="location"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block font-medium mb-1">Job Title</label>
          <input
            id="jobTitle"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
            placeholder="Your job title"
          />
        </div>
        <div>
          <label htmlFor="githubUrl" className="block font-medium mb-1">GitHub URL</label>
          <input
            id="githubUrl"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={githubUrl}
            onChange={e => setGithubUrl(e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </div>
        <div>
          <label htmlFor="linkedinUrl" className="block font-medium mb-1">LinkedIn URL</label>
          <input
            id="linkedinUrl"
            type="text"
            className="w-full rounded border px-3 py-2"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 bg-gray-100"
            value={user?.email || ""}
            disabled
          />
        </div>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
