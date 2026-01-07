import styles from "./Bot.module.scss";
import { Typography } from "@/components/Typography";
import { CheckIconTG, SafeLogistBotQrCard } from "@/icons";
import type { BotContent } from "@/types/landing";

type Props = {
  content: BotContent;
};

export default function Bot({ content }: Props) {
  const data = content;

  return (
    <section className={styles.bot}>
      <div className={styles.headings}>
        <Typography as="h1" size={24} desktopSize={24} blue={true} text={data.title} />

        <h2 className={styles.subtitle}>
          {data.subtitle_text}{" "}
          <a
            href={data.subtitle_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.subtitleLink}
          >
            {data.subtitle_link_text}
          </a>
          {data.subtitle_after_link && ` ${data.subtitle_after_link}`}
        </h2>
      </div>

      <div className={styles.card}>
        <div className={styles.list}>
          {data.items.map((item, index) => (
            <div key={index} className={styles.listItem}>
              <span className={styles.listIcon}>
                <CheckIconTG size={24} />
              </span>
              <div className={styles.listText}>
                <Typography as="h3" size={18} desktopSize={18} blue={true} white={true} weight="normal" text={item.title} />
                <Typography as="h4" size={16} desktopSize={16} white={true} weight="normal" text={item.text} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.qrWrap}>
          <SafeLogistBotQrCard className={styles.qr} size={200} />
          <a
            href={data.bot_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.handle}
          >
            {data.bot_handle}
          </a>
        </div>
      </div>
    </section>
  );
}
