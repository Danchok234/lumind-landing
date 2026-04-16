import React from 'react';
import { Badge, Card, Typography } from '@/components/ui';
import { clsx } from '@/lib/clsx';
import styles from './AuthEventShowcase.module.scss';

interface EventItem {
  title: string;
  type: string;
  date: string;
  city: string;
  rotate: number;
  coverClassName: string;
}

const EVENTS: EventItem[] = [
  {
    title: 'Midnight Build Race',
    type: 'Hackathons',
    date: 'Apr 22, 2026',
    city: 'Berlin',
    rotate: -7,
    coverClassName: 'coverPurple',
  },
  {
    title: 'Cloud Native Frontiers',
    type: 'Conferences',
    date: 'May 10, 2026',
    city: 'Lisbon',
    rotate: 5,
    coverClassName: 'coverLilac',
  },
  {
    title: 'Scale Product Summit',
    type: 'Summits',
    date: 'Jun 03, 2026',
    city: 'Amsterdam',
    rotate: -4,
    coverClassName: 'coverDark',
  },
  {
    title: 'Frontend Patterns Lab',
    type: 'Workshops',
    date: 'Jun 19, 2026',
    city: 'Warsaw',
    rotate: 6,
    coverClassName: 'coverSky',
  },
  {
    title: 'Builders Night',
    type: 'Tech meetups',
    date: 'Jul 11, 2026',
    city: 'Prague',
    rotate: -3,
    coverClassName: 'coverMixed',
  },
];

export interface AuthEventShowcaseProps {
  side: 'left' | 'right';
}

export function AuthEventShowcase({ side }: AuthEventShowcaseProps) {
  return (
    <aside className={clsx(styles.showcase, side === 'right' && styles.right)} aria-hidden="true">
      {EVENTS.map((event) => {
        const angle = side === 'left' ? event.rotate : -event.rotate;

        return (
          <div key={`${event.title}-${event.date}`} style={{ transform: `rotate(${angle}deg)` }}>
            <Card className={styles.card}>
              <div className={clsx(styles.cover, styles[event.coverClassName as keyof typeof styles])} />
              <div className={styles.meta}>
                <Badge>{event.type}</Badge>
                <Typography variant="h4" as="h3">
                  {event.title}
                </Typography>
                <Typography variant="p-small">{event.date}</Typography>
                <Typography variant="p-small">{event.city}</Typography>
              </div>
            </Card>
          </div>
        );
      })}
    </aside>
  );
}

