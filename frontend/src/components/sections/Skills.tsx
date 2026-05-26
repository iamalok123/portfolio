import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SKILL_GROUPS, SKILL_ORBIT } from '../../data/skills'

export function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-muted">
            // tech_stack
          </p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            My Tech Stack
          </h2>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
            hidden: {},
          }}
        >
          {SKILL_ORBIT.map(({ label, Icon }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-1 hover:border-foreground/35"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent text-bg transition group-hover:scale-105">
                <Icon size={19} />
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {},
          }}
        >
          {SKILL_GROUPS.map(({ category, skills, Icon }) => (
            <motion.div
              key={category}
              variants={{
                hidden: { opacity: 0, y: 26 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 21 }}
              className="flex min-h-full flex-col rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-foreground/35"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-2 text-foreground">
                  <Icon size={18} />
                </span>
                <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-muted">
                  {category}
                </h3>
              </div>

              <motion.div
                className="flex flex-wrap items-start gap-2.5"
                variants={{
                  visible: { transition: { staggerChildren: 0.035 } },
                  hidden: {},
                }}
              >
                {skills.map(({ label, Icon }) => (
                  <motion.span
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -10, scale: 0.96 },
                      visible: { opacity: 1, x: 0, scale: 1 },
                    }}
                    whileHover="hover"
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    className="group/skill inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-2 text-sm font-medium text-foreground transition hover:border-foreground/45 hover:bg-bg"
                  >
                    <motion.span
                      variants={{ hover: { x: 2, scale: 1.04 } }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      className="grid h-7 min-w-7 shrink-0 place-items-center rounded-full border border-border bg-bg text-foreground"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </motion.span>
                    <motion.span
                      variants={{ hover: { x: 2 } }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
