import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getProfile,
  getReviews,
  getSameAreaCreators,
  getSimilarCreators,
  getAreaByName,
} from "@/lib/profiles";
import { CreatorCard } from "@/components/common/creator-card";
import { SectionHeader } from "@/components/home/home-bits";
import { ProfileHeader } from "@/components/profile/profile-header";
import { StylesSection } from "@/components/profile/styles-section";
import { ReviewsSection } from "@/components/profile/reviews-section";
import { SimilarProfiles } from "@/components/profile/similar-profiles";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = getProfile((await params).username);
  return {
    title: profile ? `${profile.handle} on Sneakily` : "Creator not found",
  };
}

export default async function CreatorPage({ params }: Props) {
  const profile = getProfile((await params).username);
  if (!profile) notFound();

  const reviews = getReviews(profile);
  const similar = getSimilarCreators(profile, 8);
  const sameArea = getSameAreaCreators(
    profile,
    4,
    similar.map((c) => c.id),
  );
  const area = getAreaByName(profile.area);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 lg:px-6">
      {/* Profile: a focused, readable column */}
      <div className="mx-auto max-w-4xl space-y-14 pt-4 md:pt-8">
        <Button
          nativeButton={false}
          variant={"ghost"}
          size={"sm"}
          render={<Link href="/explore" />}
          className={"-ml-2"}
        >
          <ArrowLeft aria-hidden />
          Back to explore
        </Button>

        <ProfileHeader profile={profile} />
        <StylesSection profile={profile} />
        <ReviewsSection profile={profile} reviews={reviews} />
      </div>

      {/* Discovery: full width */}
      {similar.length > 0 && (
        <div className="mt-24">
          <SimilarProfiles creators={similar} />
        </div>
      )}

      {sameArea.length > 0 && (
        <section aria-labelledby="area-heading" className="mt-24">
          <SectionHeader
            id="area-heading"
            title={`More creators in ${profile.area}`}
            description="Other profiles close to the same area."
            href={`/explore?area=${area?.slug ?? ""}`}
            cta={`All in ${profile.area}`}
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sameArea.map((c) => (
              <li key={c.id}>
                <CreatorCard creator={c} showServices />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
