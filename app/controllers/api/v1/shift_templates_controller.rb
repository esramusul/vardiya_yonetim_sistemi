module Api
  module V1
    class ShiftTemplatesController < ApplicationController
      before_action :require_admin!, except: [:index, :show]
      before_action :set_template, only: [:show, :update, :destroy]

      def index
        render json: ShiftTemplate.all.order(:name)
      end

      def show
        render json: @shift_template
      end

      def create
        st = ShiftTemplate.new(st_params)
        if st.save
          render json: st, status: :created
        else
          render json: { errors: st.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @shift_template.update(st_params)
          render json: @shift_template
        else
          render json: { errors: @shift_template.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @shift_template.destroy
        head :no_content
      end

      private

      def set_template
        @shift_template = ShiftTemplate.find(params[:id])
      end

      def st_params
        params.require(:shift_template).permit(:name, :start_time, :end_time)
      end
    end
  end
end
