import React from 'react';
import styled from 'styled-components';

// --- UPDATE: Props mein companyName aur email add kiya ---
interface ProfileCardProps {
  name: string;
  about: string;
  avatarUrl: string | null;
  onAvatarClick: () => void;
  companyName: string; // Naya prop
  email: string;       // Naya prop
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, about, avatarUrl, onAvatarClick, companyName, email }) => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* Mail button hata diya gaya hai */}
        <div className="profile-pic" onClick={onAvatarClick} title="Click to change picture">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" />
          ) : (
            // Default SVG Avatar
            <svg version="1.1" id="svg2" width="666.66669" height="666.66669" viewBox="0 0 666.66669 666.66669" xmlns="http://www.w3.org/2000/svg">
              {/* Poora SVG code yahaan hai... */}
              <g transform="matrix(1.3333333,0,0,-1.3333333,0,666.66667)">
                <g transform="scale(0.1)">
                  <path style={{fill: '#fff8f6'}} d="M 0,0 H 5000 V 5000 H 0 Z" />
                  <path style={{fill: '#fef0ef'}} d="M 0,1126.2 H 4487.25 V 5000 H 0 Z" />
                  <path style={{fill: '#fde4e1'}} d="M 5000,561.691 4487.25,1126.2 V 5000 H 5000 Z" />
                  <path style={{fill: '#fcd0ce'}} d="M 4487.25,1146.2 5000,590.422 V 530.859 L 4487.25,1106.22 0,1106.2 v 40 z" />
                  {/* Baaki ke saare <path> elements... */}
                </g>
              </g>
            </svg>
          )}
        </div>
        <div className="bottom">
          <div className="content">
            <span className="name">{name}</span>
            <span className="about-me">{about}</span>
          </div>
          {/* --- UPDATE: Social links aur button ki jagah company details --- */}
          <div className="bottom-bottom">
            <div className="company-details">
              <span className="company-name">{companyName}</span>
              <span className="email">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// CSS-in-JS code update kiya gaya hai
const StyledWrapper = styled.div`
  .card {
    width: 280px;
    height: 280px;
    background: #fff;
    border-radius: 32px;
    padding: 3px;
    position: relative;
    box-shadow: #604b4a30 0px 70px 30px -50px;
    transition: all 0.5s ease-in-out;
  }

  /* Mail icon aur uske styles hata diye gaye hain */

  .card .profile-pic {
    position: absolute;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
    border-radius: 29px;
    z-index: 1;
    border: 0px solid #fbb9b6;
    overflow: hidden;
    transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
    cursor: pointer;
  }
  .card .profile-pic img, .card .profile-pic svg {
    object-fit: cover;
    width: 100%;
    height: 100%;
    object-position: 0px 0px;
    transition: all 0.5s ease-in-out 0s;
  }
  .card:hover .profile-pic svg {
    transform-origin: 45% 20%;
  }
  .card .bottom {
    position: absolute;
    bottom: 3px;
    left: 3px;
    right: 3px;
    background: #fbb9b6;
    top: 80%;
    border-radius: 29px;
    z-index: 2;
    box-shadow: rgba(96, 75, 74, 0.188) 0px 5px 5px 0px inset;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }
  .card .bottom .content {
    position: absolute;
    bottom: 0;
    left: 1.5rem;
    right: 1.5rem;
    height: 160px;
  }
  .card .bottom .content .name {
    display: block;
    font-size: 1.2rem;
    color: white;
    font-weight: bold;
  }
  .card .bottom .content .about-me {
    display: block;
    font-size: 0.9rem;
    color: white;
    margin-top: 1rem;
    line-height: 1.2;
  }
  .card .bottom .bottom-bottom {
    position: absolute;
    bottom: 1.2rem;
    left: 1.5rem;
    right: 1.5rem;
  }

  /* --- UPDATE: Company details ke liye naye styles --- */
  .card .bottom .bottom-bottom .company-details {
    color: white;
    line-height: 1.3;
  }
  .card .bottom .bottom-bottom .company-name {
    display: block;
    font-weight: bold;
    font-size: 0.8rem;
  }
  .card .bottom .bottom-bottom .email {
    display: block;
    font-size: 0.75rem;
    opacity: 0.8;
  }

  /* Contact me button aur social links ke styles hata diye gaye hain */

  .card:hover {
    border-top-left-radius: 55px;
  }
  .card:hover .bottom {
    top: 20%;
    border-radius: 80px 29px 29px 29px;
    transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
  }
  .card:hover .profile-pic {
    width: 100px;
    height: 100px;
    aspect-ratio: 1;
    top: 10px;
    left: 10px;
    border-radius: 50%;
    z-index: 3;
    border: 7px solid #fbb9b6;
    box-shadow: rgba(96, 75, 74, 0.188) 0px 5px 5px 0px;
    transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
  }
  .card:hover .profile-pic:hover {
    transform: scale(1.3);
    border-radius: 0px;
  }
  .card:hover .profile-pic img {
    transform: scale(1.5);
    object-position: 0px 25px;
    transition: all 0.5s ease-in-out 0.5s;
  }
  .card:hover .profile-pic svg {
    transform: scale(1.8);
    transition: all 0.5s ease-in-out 0.5s;
  }
`;

export default ProfileCard;

