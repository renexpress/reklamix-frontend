/**
 * Theme Selector Component
 * Step 2: Display 3 AI-generated themes and allow selection
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectTheme } from '@/hooks/useApi';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Check } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  scene_prompt: string;
}

interface ThemeSelectorProps {
  jobId: number;
  themes: Theme[];
  productInfo?: any;
  onThemeSelected: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  jobId,
  themes,
  productInfo,
  onThemeSelected,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const selectThemeMutation = useSelectTheme({
    onSuccess: () => {
      toast({
        title: t('create.theme.theme_selected'),
        description: t('create.theme.proceed_generation'),
      });
      onThemeSelected();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: t('create.theme.toast_error_title'),
        description: getErrorMessage(error),
      });
    },
  });

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    selectThemeMutation.mutate({ jobId, themeId });
  };

  return (
    <div className="space-y-6">
      {/* Product Info Summary */}
      {productInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('create.theme.product_analysis')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('create.theme.category')}</p>
              <p className="text-lg">{productInfo.category || t('create.theme.not_defined')}</p>
            </div>
            {productInfo.type && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('create.theme.type')}</p>
                <p>{productInfo.type}</p>
              </div>
            )}
            {productInfo.short_description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('create.theme.description')}</p>
                <p className="text-sm">{productInfo.short_description}</p>
              </div>
            )}
            {productInfo.key_attributes && productInfo.key_attributes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t('create.theme.key_features')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {productInfo.key_attributes.map((attr: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {attr}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Theme Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{t('create.theme.select_style')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('create.theme.we_created')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            const isLoading = selectThemeMutation.isPending && isSelected;

            return (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => !selectThemeMutation.isPending && handleSelectTheme(theme.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {theme.name}
                    {isSelected && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full mt-4"
                    variant={isSelected ? 'default' : 'outline'}
                    disabled={selectThemeMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTheme(theme.id);
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('create.theme.button_selecting')}
                      </>
                    ) : isSelected ? (
                      t('create.theme.button_selected')
                    ) : (
                      t('create.theme.button_select')
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
