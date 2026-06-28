import { Camera } from "lucide-react";

function AvatarUploader({ user, avatar, onChange }) {
    return (
        <label className="avatar-upload">
            {avatar ? (
                <img src={avatar} alt="Foto de perfil" />
            ) : (
                <span>{user?.name?.charAt(0) || "U"}</span>
            )}

            <input type="file" accept="image/*" onChange={onChange} />

            <div className="camera-badge">
                <Camera size={16} />
            </div>
        </label>
    );
}

export default AvatarUploader;
