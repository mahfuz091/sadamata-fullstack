"use client";

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BlogSectionCards({ statistics }) {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      {/* Total Blog Posts */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Meeting Posts</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.blogPosts}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.blogPosts} this
              month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>
      {/* Total Press Posts */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Press Posts</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.pressPosts}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.pressPosts} this
              month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>
      {/* Total Client Feedback */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Client Feedback</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.corporateClientFeedback}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+
              {statistics.thisMonth.counts.corporateClientFeedback} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>
      {/* Total Hotels */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Hotels</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.hotels}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.hotels} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>
      {/* Total Rooms */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Rooms</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.rooms}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.rooms} this month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>
      {/* Total Careers */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Career Posts</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.careers}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.careers} this
              month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            More content being published <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>Keep up the consistency!</div>
        </CardFooter>
      </Card>

      {/* Total Bookings */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Bookings</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {statistics.counts.bookings}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <IconTrendingUp />+{statistics.thisMonth.counts.bookings} this
              month
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='hidden items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Growing community <IconTrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            New users joining regularly
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
