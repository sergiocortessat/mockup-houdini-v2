'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { InputWithLabelAnimation } from '@/components/ui/input-with-label-animation';
import { useSendContactMutation } from '@/graphql/generated';

const formSchema = z.object({
  email: z.string().email(),
  website: z.string().min(1),
  telegram: z.string().optional(),
  discord: z.string().optional(),
  twitter: z.string().optional(),
  description: z.string().optional(),
  token: z.string().optional(),
  tokenChain: z.string().optional(),
  referral: z.string().optional(),
});

export default function GetApiAccess() {
  const t = useTranslations('getApiAccess');
  const [sendContact] = useSendContactMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      website: '',
      telegram: '',
      discord: '',
      twitter: '',
      description: '',
      token: '',
      tokenChain: '',
      referral: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await sendContact({
      variables: {
        email: values.email,
        website: values.website,
        telegram: values.telegram || '',
        discord: values.discord || '',
        twitter: values.twitter || '',
        description: values.description || '',
        token: values.token || '',
        tokenChain: values.tokenChain || '',
        referral: values.referral || '',
      },
      onCompleted: () => {
        form.reset();
        toast.success(t('reqSubmitted'));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    setIsSubmitting(false);
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-center p-2 md:mt-10">
      <div className="w-full max-w-[500px] space-y-6">
        <div className="space-y-2 px-2 text-center md:text-left">
          <h1 className="text-display-xs md:text-display-lg">
            {t('requestIntegrationAccess')}
          </h1>
          <p className="text-heading-xs md:text-heading-sm text-neutral-500">
            {t('integrationAccessText')}
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-2"
          >
            <div className="flex flex-col gap-6 rounded-3xl border border-neutral-900 p-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('websiteText')}
                        aria-required="true"
                        inputClassName="bg-neutral-900 !rounded-sm"
                        aria-invalid={
                          form.formState.errors.website ? 'true' : 'false'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('telegramText')}
                        aria-invalid={
                          form.formState.errors.telegram ? 'true' : 'false'
                        }
                        inputClassName="bg-neutral-900 !rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('discordText')}
                        aria-invalid={
                          form.formState.errors.discord ? 'true' : 'false'
                        }
                        inputClassName="bg-neutral-900 !rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('twitterText')}
                        aria-invalid={
                          form.formState.errors.twitter ? 'true' : 'false'
                        }
                        inputClassName="bg-neutral-900 !rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('descriptionText')}
                        {...field}
                        inputClassName="bg-neutral-900 !rounded-sm"
                        aria-invalid={
                          form.formState.errors.description ? 'true' : 'false'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('emailText')}
                        aria-required="true"
                        inputClassName="bg-neutral-900 !rounded-sm"
                        aria-invalid={
                          form.formState.errors.email ? 'true' : 'false'
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('tokenText')}
                        {...field}
                        inputClassName="bg-neutral-900 !rounded-sm"
                        aria-invalid={
                          form.formState.errors.token ? 'true' : 'false'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenChain"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelAnimation
                        label={t('tokenChain')}
                        aria-invalid={
                          form.formState.errors.tokenChain ? 'true' : 'false'
                        }
                        inputClassName="bg-neutral-900 !rounded-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sr-only" aria-live="polite">
              {form.formState.isSubmitting ? t('submitting') : ''}
              {form.formState.isSubmitSuccessful ? t('reqSubmitted') : ''}
            </div>

            <Button
              type="submit"
              className="text-label-xs md:text-label-sm w-full py-3"
              size="xl"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
