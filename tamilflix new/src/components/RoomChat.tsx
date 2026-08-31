import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SendIcon } from 'lucide-react';
import type { ChatMessage } from '../types/movie';

interface RoomChatProps {
  messages: ChatMessage[];
  username: string;
  onSend: (message: string) => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;

function timeLabel(timestamp?: string | number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function RoomChat({ messages, username, onSend }: RoomChatProps) {
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <section
      aria-label="Room chat"
      className="flex min-h-[22rem] flex-1 flex-col overflow-hidden rounded-3xl border border-rose-400/10 bg-ink-800/70 backdrop-blur-xl">
      
      <header className="border-b border-white/[0.06] px-5 py-3.5">
        <h2 className="font-display text-xl tracking-wide text-white">Chat</h2>
      </header>

      <div ref={listRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 &&
        <p className="py-10 text-center text-xs text-muted">
            No messages yet. Say something before the titles roll.
          </p>
        }

        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            if (message.type === 'system') {
              return (
                <motion.p
                  key={`sys-${index}-${message.timestamp ?? ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="text-center text-[0.68rem] uppercase tracking-[0.18em] text-muted/70">
                  
                  {message.message}
                </motion.p>);

            }

            const mine = message.username === username;
            return (
              <motion.div
                key={`msg-${index}-${message.timestamp ?? ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                
                {!mine &&
                <span className="mb-1 px-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-rose-300/80">
                    {message.username}
                  </span>
                }
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  mine ?
                  'rounded-br-md bg-cherry-800 text-white' :
                  'rounded-bl-md border border-white/[0.08] bg-white/[0.04] text-white/85'}`
                  }>
                  
                  {message.message}
                </div>
                {message.timestamp &&
                <span className="mt-1 px-1 text-[0.6rem] text-muted/60">
                    {timeLabel(message.timestamp)}
                  </span>
                }
              </motion.div>);

          })}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Message the room…"
          aria-label="Message the room"
          className="w-full rounded-full border border-white/10 bg-ink/60 px-4 py-2.5 text-sm text-white placeholder:text-muted/60 outline-none transition-[border-color] duration-200 ease-cine focus:border-rose-400/60" />
        
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send message"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cherry-700 text-white transition-[background-color,transform,opacity] duration-200 ease-cine hover:bg-rose-400 hover:text-ink active:scale-95 disabled:opacity-40">
          
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
    </section>);

}