"""add specialists table

Revision ID: add_specialists_table
Revises: a1b2c3d4e5f6
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_specialists_table'
down_revision = 'add_is_read_to_questions'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('specialists',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('position', sa.String(), nullable=False),
        sa.Column('specialization', sa.Text(), nullable=True),
        sa.Column('workplace', sa.Text(), nullable=True),
        sa.Column('education', sa.String(), nullable=True),
        sa.Column('extra_qual', sa.Text(), nullable=True),
        sa.Column('photo', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_specialists_id'), 'specialists', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_specialists_id'), table_name='specialists')
    op.drop_table('specialists') 