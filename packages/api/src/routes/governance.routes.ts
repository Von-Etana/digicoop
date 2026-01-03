import { Router } from 'express';
import { prisma } from '@digicoop/database';

const router = Router();

// Get all active polls
router.get('/polls', async (req, res, next) => {
    try {
        const polls = await prisma.poll.findMany({
            where: { endDate: { gte: new Date() } },
            include: { options: true },
            orderBy: { endDate: 'asc' }
        });
        res.json({ status: 'success', data: polls });
    } catch (error) {
        next(error);
    }
});

// Vote on a poll
router.post('/polls/:id/vote', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { optionId } = req.body;

        // Check if already voted
        const existingVote = await prisma.vote.findUnique({
            where: { pollId_userId: { pollId: id, userId } }
        });

        if (existingVote) {
            return res.status(400).json({ status: 'error', message: 'Already voted on this poll' });
        }

        const poll = await prisma.poll.findUnique({ where: { id } });
        if (!poll || new Date() > new Date(poll.endDate)) {
            return res.status(400).json({ status: 'error', message: 'Poll is closed' });
        }

        await prisma.vote.create({
            data: {
                pollId: id,
                optionId,
                userId
            }
        });

        res.json({ status: 'success', message: 'Vote recorded' });
    } catch (error) {
        next(error);
    }
});

// Get poll results
router.get('/polls/:id/results', async (req, res, next) => {
    try {
        const { id } = req.params;
        const options = await prisma.pollOption.findMany({
            where: { pollId: id },
            include: {
                _count: { select: { votes: true } }
            }
        });

        const results = options.map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: opt._count.votes
        }));

        res.json({ status: 'success', data: results });
    } catch (error) {
        next(error);
    }
});

// Get all events
router.get('/events', async (req, res, next) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        res.json({ status: 'success', data: events });
    } catch (error) {
        next(error);
    }
});

// RSVP to an event
router.post('/events/:id/rsvp', async (req, res, next) => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;
        const { status } = req.body; // GOING, NOT_GOING, MAYBE

        await prisma.eventRsvp.upsert({
            where: { eventId_userId: { eventId: id, userId } },
            update: { status },
            create: { eventId: id, userId, status }
        });

        res.json({ status: 'success', message: 'RSVP recorded' });
    } catch (error) {
        next(error);
    }
});

// Admin: Create poll
router.post('/polls', async (req, res, next) => {
    try {
        const { question, endDate, options } = req.body;

        const poll = await prisma.poll.create({
            data: {
                question,
                endDate: new Date(endDate),
                options: {
                    create: options.map((text: string) => ({ text }))
                }
            },
            include: { options: true }
        });

        res.json({ status: 'success', data: poll });
    } catch (error) {
        next(error);
    }
});

// Admin: Create event
router.post('/events', async (req, res, next) => {
    try {
        const { title, date, location, imageUrl } = req.body;

        const event = await prisma.event.create({
            data: {
                title,
                date: new Date(date),
                location,
                imageUrl
            }
        });

        res.json({ status: 'success', data: event });
    } catch (error) {
        next(error);
    }
});

export default router;
