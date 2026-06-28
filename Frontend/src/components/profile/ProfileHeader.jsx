import AvatarUploader from "./AvatarUploader";

function ProfileHeader({ user, avatar, onAvatarChange }) {
    return (
        <section className="profile-header">
            <AvatarUploader user={user} avatar={avatar} onChange={onAvatarChange} />

            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
        </section>
    );
}

export default ProfileHeader;
