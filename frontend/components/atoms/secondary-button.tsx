import { buttonVariants } from "@/components/ui/button";
import Link from "next/link"; // Correct import
import { FC } from "react"; // Import FC for type safety

interface SecondaryButtonProps {
  buttonName: string;
}

const SecondaryButton: FC<SecondaryButtonProps> = ({ buttonName }) => {
  return (
    <Link
      className={buttonVariants({ variant: "secondary" })}
      href={`/designs/${buttonName}`} // Template literal for readability
    >
      {buttonName}
    </Link>
  );
};

export default SecondaryButton;
