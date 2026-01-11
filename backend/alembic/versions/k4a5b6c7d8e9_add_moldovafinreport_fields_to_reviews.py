"""add moldovafinreport fields to reviews

Revision ID: k4a5b6c7d8e9
Revises: j3a4b5c6d7e8
Create Date: 2026-01-11 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = 'k4a5b6c7d8e9'
down_revision = 'j3a4b5c6d7e8'
branch_labels = None
depends_on = None


def upgrade():
    # Add moldovafinreport fields to reviews table
    op.add_column('reviews', sa.Column('fiscal_code', sa.String(), nullable=True, comment='Фискальный код компании'))
    op.add_column('reviews', sa.Column('report_type', sa.String(), nullable=True, comment='Тип отчета'))
    op.add_column('reviews', sa.Column('report_year', sa.Integer(), nullable=True, comment='Год отчета'))
    op.add_column('reviews', sa.Column('detail_data', JSONB, nullable=True, comment='Детальные данные'))
    op.add_column('reviews', sa.Column('detailed_data', JSONB, nullable=True, comment='Подробные данные'))
    
    # Add legalEntity fields from detail_data
    op.add_column('reviews', sa.Column('cuiio', sa.String(), nullable=True, comment='CUIIO код'))
    op.add_column('reviews', sa.Column('email', sa.String(), nullable=True, comment='Email компании'))
    op.add_column('reviews', sa.Column('phone', sa.String(), nullable=True, comment='Телефон компании'))
    op.add_column('reviews', sa.Column('postal_code', sa.String(), nullable=True, comment='Почтовый индекс'))
    op.add_column('reviews', sa.Column('street_address', sa.String(), nullable=True, comment='Улица и номер дома'))
    op.add_column('reviews', sa.Column('caem_code', sa.String(), nullable=True, comment='CAEM код деятельности'))
    op.add_column('reviews', sa.Column('caem_name', sa.String(), nullable=True, comment='CAEM название деятельности'))
    op.add_column('reviews', sa.Column('cfoj_code', sa.String(), nullable=True, comment='CFOJ код организационной формы'))
    op.add_column('reviews', sa.Column('cfoj_name', sa.String(), nullable=True, comment='CFOJ название организационной формы'))
    op.add_column('reviews', sa.Column('cfp_code', sa.String(), nullable=True, comment='CFP код формы собственности'))
    op.add_column('reviews', sa.Column('cfp_name', sa.String(), nullable=True, comment='CFP название формы собственности'))
    op.add_column('reviews', sa.Column('employees_count', sa.String(), nullable=True, comment='Количество сотрудников'))
    op.add_column('reviews', sa.Column('accountant', sa.String(), nullable=True, comment='Бухгалтер'))
    op.add_column('reviews', sa.Column('accountant_phone', sa.String(), nullable=True, comment='Телефон бухгалтера'))
    op.add_column('reviews', sa.Column('responsible_person', sa.String(), nullable=True, comment='Ответственное лицо'))
    op.add_column('reviews', sa.Column('report_status', sa.String(), nullable=True, comment='Статус отчета'))
    op.add_column('reviews', sa.Column('is_audited', sa.Boolean(), nullable=True, comment='Аудирован ли отчет'))
    op.add_column('reviews', sa.Column('declaration_date', sa.String(), nullable=True, comment='Дата декларации'))
    op.add_column('reviews', sa.Column('web', sa.String(), nullable=True, comment='Веб-сайт компании'))
    op.add_column('reviews', sa.Column('cuatm_code', sa.String(), nullable=True, comment='CUATM код населенного пункта'))
    op.add_column('reviews', sa.Column('cuatm_name', sa.String(), nullable=True, comment='CUATM название населенного пункта'))
    op.add_column('reviews', sa.Column('entity_type', sa.String(), nullable=True, comment='Тип юридического лица'))
    op.add_column('reviews', sa.Column('liquidation', sa.Boolean(), nullable=True, comment='В ликвидации'))
    op.add_column('reviews', sa.Column('period_from', sa.String(), nullable=True, comment='Период отчета с'))
    op.add_column('reviews', sa.Column('period_to', sa.String(), nullable=True, comment='Период отчета по'))
    op.add_column('reviews', sa.Column('signed', sa.Boolean(), nullable=True, comment='Подписан ли отчет'))
    op.add_column('reviews', sa.Column('report_create_date', sa.String(), nullable=True, comment='Дата создания отчета'))
    op.add_column('reviews', sa.Column('report_update_date', sa.String(), nullable=True, comment='Дата обновления отчета'))
    op.add_column('reviews', sa.Column('fiscal_date', sa.String(), nullable=True, comment='Фискальная дата'))
    op.add_column('reviews', sa.Column('economic_agent_id', sa.String(), nullable=True, comment='ID экономического агента'))
    op.add_column('reviews', sa.Column('import_file_name', sa.String(), nullable=True, comment='Имя импортированного файла'))
    op.add_column('reviews', sa.Column('employees_abs', sa.String(), nullable=True, comment='Количество отсутствующих сотрудников'))
    op.add_column('reviews', sa.Column('organization_id', sa.String(), nullable=True, comment='ID организации'))
    op.add_column('reviews', sa.Column('organization_name', sa.String(), nullable=True, comment='Название организации'))
    op.add_column('reviews', sa.Column('fisc', sa.String(), nullable=True, comment='Фискальный код (короткий)'))
    op.add_column('reviews', sa.Column('legal_entity_id', sa.String(), nullable=True, comment='ID юридического лица'))
    
    # Create indexes for better performance
    op.create_index('ix_reviews_fiscal_code', 'reviews', ['fiscal_code'])
    op.create_index('ix_reviews_report_type', 'reviews', ['report_type'])
    op.create_index('ix_reviews_report_year', 'reviews', ['report_year'])
    op.create_index('ix_reviews_cuiio', 'reviews', ['cuiio'])
    op.create_index('ix_reviews_email', 'reviews', ['email'])
    op.create_index('ix_reviews_caem_code', 'reviews', ['caem_code'])
    op.create_index('ix_reviews_cuatm_code', 'reviews', ['cuatm_code'])
    op.create_index('ix_reviews_liquidation', 'reviews', ['liquidation'])
    op.create_index('ix_reviews_entity_type', 'reviews', ['entity_type'])


def downgrade():
    op.drop_index('ix_reviews_entity_type', table_name='reviews')
    op.drop_index('ix_reviews_liquidation', table_name='reviews')
    op.drop_index('ix_reviews_cuatm_code', table_name='reviews')
    op.drop_index('ix_reviews_caem_code', table_name='reviews')
    op.drop_index('ix_reviews_email', table_name='reviews')
    op.drop_index('ix_reviews_cuiio', table_name='reviews')
    op.drop_index('ix_reviews_report_year', table_name='reviews')
    op.drop_index('ix_reviews_report_type', table_name='reviews')
    op.drop_index('ix_reviews_fiscal_code', table_name='reviews')
    
    op.drop_column('reviews', 'legal_entity_id')
    op.drop_column('reviews', 'fisc')
    op.drop_column('reviews', 'organization_name')
    op.drop_column('reviews', 'organization_id')
    op.drop_column('reviews', 'employees_abs')
    op.drop_column('reviews', 'import_file_name')
    op.drop_column('reviews', 'economic_agent_id')
    op.drop_column('reviews', 'fiscal_date')
    op.drop_column('reviews', 'report_update_date')
    op.drop_column('reviews', 'report_create_date')
    op.drop_column('reviews', 'signed')
    op.drop_column('reviews', 'period_to')
    op.drop_column('reviews', 'period_from')
    op.drop_column('reviews', 'liquidation')
    op.drop_column('reviews', 'entity_type')
    op.drop_column('reviews', 'cuatm_name')
    op.drop_column('reviews', 'cuatm_code')
    op.drop_column('reviews', 'web')
    op.drop_column('reviews', 'declaration_date')
    op.drop_column('reviews', 'is_audited')
    op.drop_column('reviews', 'report_status')
    op.drop_column('reviews', 'responsible_person')
    op.drop_column('reviews', 'accountant_phone')
    op.drop_column('reviews', 'accountant')
    op.drop_column('reviews', 'employees_count')
    op.drop_column('reviews', 'cfp_name')
    op.drop_column('reviews', 'cfp_code')
    op.drop_column('reviews', 'cfoj_name')
    op.drop_column('reviews', 'cfoj_code')
    op.drop_column('reviews', 'caem_name')
    op.drop_column('reviews', 'caem_code')
    op.drop_column('reviews', 'street_address')
    op.drop_column('reviews', 'postal_code')
    op.drop_column('reviews', 'phone')
    op.drop_column('reviews', 'email')
    op.drop_column('reviews', 'cuiio')
    op.drop_column('reviews', 'detailed_data')
    op.drop_column('reviews', 'detail_data')
    op.drop_column('reviews', 'report_year')
    op.drop_column('reviews', 'report_type')
    op.drop_column('reviews', 'fiscal_code')
