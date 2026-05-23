import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SKILL_GROUPS, SKILL_ORBIT } from '../../data/skills'

export function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 130, damping: 22 }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">
            // tech_stack
          </p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-foreground sm:text-6xl">
            My Tech Stack
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            Tools I use to move from product idea to working software: interfaces,
            APIs, data layers, deployments, and AI-powered workflows.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-md">
            {SKILL_ORBIT.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <span className="grid size-10 place-items-center rounded-md bg-accent text-black">
                  <Icon size={18} />
                </span>
                <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-2"
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
              className="rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/45 hover:shadow-[0_0_44px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-surface-2 text-accent">
                  <Icon size={18} />
                </span>
                <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-accent">
                  {category}
                </h3>
              </div>

              <motion.div
                className="flex flex-wrap gap-2.5"
                variants={{
                  visible: { transition: { staggerChildren: 0.035 } },
                  hidden: {},
                }}
              >
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    className="rounded-full border border-border bg-surface-2 px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-accent/60 hover:text-accent"
                  >
                    {skill}
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
