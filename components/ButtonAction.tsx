"use client";

const ButtonAction = ({ text, variant }: { text: string; variant: string }) => {
  const handleClick = async () => {
    const element = document.getElementById("posts-cards");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={() => {
        handleClick();
      }}
      className={`${variant} mt-2`}
    >
      {text}
    </button>
  );
};

export default ButtonAction;
