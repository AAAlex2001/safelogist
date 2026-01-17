"use client";

import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/button/Button";
import { useRouter } from "@/i18n/navigation";
import styles from "./not-found.module.scss";

type Props = {
  searchPlaceholder: string;
  buttonText: string;
};

export default function NotFoundClientActions({ searchPlaceholder, buttonText }: Props) {
  const router = useRouter();

  return (
    <>
      <SearchBar placeholder={searchPlaceholder} />
      <Button variant="outline" className={styles.button} onClick={() => router.push("/")}
      >
        {buttonText}
      </Button>
    </>
  );
}
