'use server';

import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';

import { createApolloClient } from '@/graphql/apollo-client';
import { PARTNER_URL_QUERY } from '@/graphql/queries.graphql';

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ partnerNickName: string }>;
}) {
  const { partnerNickName } = await params;
  revalidatePath(`/${partnerNickName}`);
  const client = createApolloClient();
  let data;
  try {
    const result = await client.query({
      query: PARTNER_URL_QUERY,
      variables: { nickname: partnerNickName },
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          cookie: 'houdini=SSR',
        },
      },
    });
    data = result.data;
  } catch (error) {
    console.error(error);
    notFound();
  }

  if (data?.partnerUrlByNickname) {
    redirect(data.partnerUrlByNickname);
  } else {
    notFound();
  }
}
