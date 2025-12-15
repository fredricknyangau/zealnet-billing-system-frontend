
import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

import { useTranslation } from 'react-i18next'

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('terms.title')}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
        <h4 className="font-semibold">{t('terms.serviceUsageTitle')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('terms.serviceUsageContent')}
        </p>

        <h4 className="font-semibold">{t('terms.dataPrivacyTitle')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('terms.dataPrivacyContent')}
        </p>

        <h4 className="font-semibold">{t('terms.paymentsTitle')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('terms.paymentsContent')}
        </p>

        <h4 className="font-semibold">{t('terms.fairUsageTitle')}</h4>
        <p className="text-sm text-muted-foreground">
          {t('terms.fairUsageContent')}
        </p>
      </div>
      <div className="flex gap-2 pt-4">
        <Button fullWidth onClick={onAccept}>{t('terms.accept')}</Button>
        <Button variant="outline" fullWidth onClick={onClose}>{t('terms.decline')}</Button>
      </div>
    </Modal>
  )
}
